import { Ionicons } from '@expo/vector-icons';
import { CameraView, type CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  type CreateDogInput,
  type Dog,
  type DogSize,
  useCreateDog,
  useDeleteDog,
  useDogs,
  useUpdateDog,
  useUploadDogPhoto,
} from '@/lib/api/dogs';
import { useAuth } from '@/lib/auth-context';

interface DogFormState {
  name: string;
  breed: string;
  age: string;
  size: DogSize;
  specialNeeds: string;
  photoUrl: string;
}

const DOG_SIZE_OPTIONS: { label: string; value: DogSize }[] = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'XL', value: 'extra_large' },
];

const EMPTY_DOG_FORM: DogFormState = {
  name: '',
  breed: '',
  age: '',
  size: 'medium',
  specialNeeds: '',
  photoUrl: '',
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
}

function formatSize(size: DogSize | null): string {
  if (!size) return 'Unspecified';
  return size.replace('_', ' ').replace(/^\w/, (char) => char.toUpperCase());
}

function mapDogToForm(dog: Dog): DogFormState {
  return {
    name: dog.name,
    breed: dog.breed ?? '',
    age: dog.age !== null ? String(dog.age) : '',
    size: dog.size ?? 'medium',
    specialNeeds: dog.special_needs ?? '',
    photoUrl: dog.photo_url ?? '',
  };
}

function buildMutationInput(formState: DogFormState): CreateDogInput {
  const parsedAge = formState.age.trim().length > 0 ? Number(formState.age.trim()) : null;
  return {
    name: formState.name.trim(),
    breed: formState.breed.trim() || null,
    age: parsedAge,
    size: formState.size,
    special_needs: formState.specialNeeds.trim() || null,
    photo_url: formState.photoUrl.trim() || null,
  };
}

function mapCapturedPhotoToAsset(capture: CameraCapturedPicture): ImagePicker.ImagePickerAsset {
  const extension = capture.format === 'png' ? 'png' : 'jpg';
  const mimeType = capture.format === 'png' ? 'image/png' : 'image/jpeg';

  return {
    uri: capture.uri,
    width: capture.width,
    height: capture.height,
    type: 'image',
    fileName: `camera-${Date.now()}.${extension}`,
    mimeType,
  };
}

function validateDogForm(ownerId: string | null, formState: DogFormState): CreateDogInput | null {
  if (!ownerId) {
    Alert.alert('Session required', 'Please sign in again to manage your dog profiles.');
    return null;
  }

  if (formState.name.trim().length === 0) {
    Alert.alert('Missing name', 'Please enter your dog name.');
    return null;
  }

  const parsedAge = formState.age.trim().length > 0 ? Number(formState.age.trim()) : null;
  if (parsedAge !== null && (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 40)) {
    Alert.alert('Invalid age', 'Age must be a whole number between 0 and 40.');
    return null;
  }

  return buildMutationInput(formState);
}

export default function MyDogsScreen() {
  const { session } = useAuth();
  const ownerId = session?.user.id ?? null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [formState, setFormState] = useState<DogFormState>(EMPTY_DOG_FORM);
  const [selectedPhotoAsset, setSelectedPhotoAsset] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);
  const [deletingDogId, setDeletingDogId] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const dogsQuery = useDogs(ownerId);
  const createDogMutation = useCreateDog(ownerId);
  const updateDogMutation = useUpdateDog(ownerId);
  const uploadDogPhotoMutation = useUploadDogPhoto(ownerId);
  const deleteDogMutation = useDeleteDog(ownerId);

  const dogs = dogsQuery.data ?? [];
  const isSaving =
    createDogMutation.isPending || updateDogMutation.isPending || uploadDogPhotoMutation.isPending;
  const isModalBusy = isSaving || isPickingPhoto || isCapturingPhoto;

  const modalTitle = useMemo(
    () => (editingDog ? 'Edit dog profile' : 'Add a new dog'),
    [editingDog],
  );

  function openAddDogModal() {
    setEditingDog(null);
    setFormState(EMPTY_DOG_FORM);
    setSelectedPhotoAsset(null);
    setIsCameraOpen(false);
    setIsCameraReady(false);
    setIsModalOpen(true);
  }

  function openEditDogModal(dog: Dog) {
    setEditingDog(dog);
    setFormState(mapDogToForm(dog));
    setSelectedPhotoAsset(null);
    setIsCameraOpen(false);
    setIsCameraReady(false);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen((current) => (isSaving ? current : false));
  }

  function setFormField<Key extends keyof DogFormState>(key: Key, value: DogFormState[Key]) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function resetFormAndCloseModal() {
    setIsModalOpen(false);
    setEditingDog(null);
    setFormState(EMPTY_DOG_FORM);
    setSelectedPhotoAsset(null);
    setIsCameraOpen(false);
    setIsCameraReady(false);
    setIsCapturingPhoto(false);
    setIsPickingPhoto(false);
  }

  async function saveDogMutation(input: CreateDogInput) {
    if (editingDog) {
      await updateDogMutation.mutateAsync({ ...input, id: editingDog.id });
      return;
    }

    await createDogMutation.mutateAsync(input);
  }

  async function handlePickPhoto() {
    if (isModalBusy) return;

    try {
      setIsPickingPhoto(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo library access to choose a dog photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const pickedAsset = result.assets[0];
      setSelectedPhotoAsset(pickedAsset);
      setFormField('photoUrl', pickedAsset.uri);
    } catch (error) {
      Alert.alert('Photo selection failed', getErrorMessage(error, 'Please try again.'));
    } finally {
      setIsPickingPhoto(false);
    }
  }

  async function handleOpenCamera() {
    if (isModalBusy) return;

    try {
      const permissionResponse = cameraPermission?.granted
        ? cameraPermission
        : await requestCameraPermission();

      if (!permissionResponse.granted) {
        Alert.alert('Permission needed', 'Please allow camera access to take a dog photo.');
        return;
      }

      setIsCameraReady(false);
      setIsCameraOpen(true);
    } catch (error) {
      Alert.alert('Camera unavailable', getErrorMessage(error, 'Please try again.'));
    }
  }

  function closeCameraModal() {
    if (isCapturingPhoto) return;
    setIsCameraOpen(false);
    setIsCameraReady(false);
  }

  async function handleTakePhoto() {
    if (!cameraRef.current || isCapturingPhoto) return;

    if (!isCameraReady) {
      Alert.alert('Camera not ready', 'Please wait a moment and try again.');
      return;
    }

    try {
      setIsCapturingPhoto(true);
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!captured) {
        Alert.alert('Camera capture failed', 'No photo was captured. Please try again.');
        return;
      }
      const capturedAsset = mapCapturedPhotoToAsset(captured);
      setSelectedPhotoAsset(capturedAsset);
      setFormField('photoUrl', capturedAsset.uri);
      setIsCameraOpen(false);
      setIsCameraReady(false);
    } catch (error) {
      Alert.alert('Camera capture failed', getErrorMessage(error, 'Please try again.'));
    } finally {
      setIsCapturingPhoto(false);
    }
  }

  function handleRemovePhoto() {
    setSelectedPhotoAsset(null);
    setFormState((current) => (isSaving ? current : { ...current, photoUrl: '' }));
  }

  async function handleSaveDog() {
    const input = validateDogForm(ownerId, formState);
    if (!input) return;

    try {
      const uploadedPhotoUrl = selectedPhotoAsset
        ? await uploadDogPhotoMutation.mutateAsync(selectedPhotoAsset)
        : input.photo_url;

      await saveDogMutation({ ...input, photo_url: uploadedPhotoUrl ?? null });
      resetFormAndCloseModal();
    } catch (error) {
      Alert.alert(
        'Unable to save profile',
        getErrorMessage(error, 'Please try again.'),
      );
    }
  }

  async function handleDeleteDog(dog: Dog) {
    try {
      setDeletingDogId(dog.id);
      await deleteDogMutation.mutateAsync(dog.id);
    } catch (error) {
      Alert.alert('Unable to delete profile', getErrorMessage(error, 'Please try again.'));
    } finally {
      setDeletingDogId(null);
    }
  }

  function confirmDeleteDog(dog: Dog) {
    Alert.alert(
      'Delete dog profile?',
      `This will permanently remove ${dog.name}'s profile.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void handleDeleteDog(dog);
          },
        },
      ],
    );
  }

  function renderDogCard({ item }: { item: Dog }) {
    return (
      <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <View className="flex-row">
          <View className="mr-4 h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
            {item.photo_url ? (
              <Image source={{ uri: item.photo_url }} className="h-full w-full" contentFit="cover" />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Ionicons name="paw" size={24} color="#6366F1" />
              </View>
            )}
          </View>

          <View className="flex-1">
            <Text className="text-lg font-bold text-slate-900">{item.name}</Text>
            <Text className="mt-1 text-sm text-slate-600">{item.breed ?? 'Breed not set'}</Text>

            <View className="mt-3 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-indigo-50 px-3 py-1">
                <Text className="text-xs font-semibold text-indigo-700">{formatSize(item.size)}</Text>
              </View>
              <View className="rounded-full bg-emerald-50 px-3 py-1">
                <Text className="text-xs font-semibold text-emerald-700">
                  {item.age !== null ? `${item.age} years` : 'Age not set'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {item.special_needs ? (
          <View className="mt-4 rounded-xl bg-amber-50 p-3">
            <Text className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Special needs
            </Text>
            <Text className="mt-1 text-sm text-amber-800">{item.special_needs}</Text>
          </View>
        ) : null}

        <View className="mt-4 flex-row gap-3">
          <Pressable
            onPress={() => { openEditDogModal(item); }}
            className="flex-1 items-center rounded-xl border border-slate-300 py-2.5"
          >
            <Text className="font-semibold text-slate-700">Edit</Text>
          </Pressable>

          <Pressable
            onPress={() => { confirmDeleteDog(item); }}
            disabled={deletingDogId === item.id}
            className="flex-1 items-center rounded-xl bg-rose-500 py-2.5 disabled:opacity-60"
          >
            <Text className="font-semibold text-white">
              {deletingDogId === item.id ? 'Deleting…' : 'Delete'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="border-b border-slate-200 bg-white px-4 pb-4 pt-12">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-bold text-slate-900">My Dogs</Text>
            <Text className="mt-1 text-sm text-slate-500">
              Build complete profiles so walkers understand each dog profile.
            </Text>
          </View>

          <Pressable
            onPress={openAddDogModal}
            className="flex-row items-center rounded-xl bg-primary px-4 py-2.5"
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text className="ml-1 font-semibold text-white">Add Dog</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-1 px-4 pt-4">
        {dogsQuery.isLoading ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator color="#4F46E5" />
            <Text className="text-sm text-slate-500">Loading dog profiles…</Text>
          </View>
        ) : null}

        {dogsQuery.isError ? (
          <View className="flex-1 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <Text className="text-center text-base font-semibold text-rose-700">
              Could not load your dogs
            </Text>
            <Text className="mt-2 text-center text-sm text-rose-600">
              {getErrorMessage(dogsQuery.error, 'Please check your connection and try again.')}
            </Text>
            <Pressable
              onPress={() => {
                void dogsQuery.refetch();
              }}
              className="mt-4 rounded-xl bg-rose-500 px-5 py-2.5"
            >
              <Text className="font-semibold text-white">Try again</Text>
            </Pressable>
          </View>
        ) : null}

        {!dogsQuery.isLoading && !dogsQuery.isError && dogs.length === 0 ? (
          <View className="flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
              <Ionicons name="paw" size={28} color="#4F46E5" />
            </View>
            <Text className="mt-4 text-xl font-bold text-slate-900">No dog profiles yet</Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
              Add your first dog to start booking trusted walkers.
            </Text>
            <Pressable onPress={openAddDogModal} className="mt-6 rounded-xl bg-primary px-6 py-3">
              <Text className="font-semibold text-white">Create first profile</Text>
            </Pressable>
          </View>
        ) : null}

        {!dogsQuery.isLoading && !dogsQuery.isError && dogs.length > 0 ? (
          <FlatList
            data={dogs}
            keyExtractor={(item) => item.id}
            renderItem={renderDogCard}
            contentContainerStyle={{ paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
          />
        ) : null}
      </View>

      <Modal transparent animationType="slide" visible={isModalOpen} onRequestClose={closeModal}>
        <View className="flex-1 justify-end bg-black/45">
          <View className="max-h-[88%] rounded-t-3xl bg-white px-5 pb-7 pt-4">
            <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-slate-300" />
            <Text className="text-xl font-bold text-slate-900">{modalTitle}</Text>
            <Text className="mt-1 text-sm text-slate-500">
              Add important details so walkers can provide the best care.
            </Text>

            <ScrollView className="mt-5" showsVerticalScrollIndicator={false}>
              <View className="gap-3">
                <View>
                  <Text className="mb-1.5 text-sm font-medium text-slate-700">Dog Name *</Text>
                  <TextInput
                    value={formState.name}
                    onChangeText={(value) => { setFormField('name', value); }}
                    editable={!isSaving}
                    placeholder="e.g. Milo"
                    placeholderTextColor="#94A3B8"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  />
                </View>

                <View>
                  <Text className="mb-1.5 text-sm font-medium text-slate-700">Breed</Text>
                  <TextInput
                    value={formState.breed}
                    onChangeText={(value) => { setFormField('breed', value); }}
                    editable={!isSaving}
                    placeholder="e.g. Golden Retriever"
                    placeholderTextColor="#94A3B8"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  />
                </View>

                <View>
                  <Text className="mb-1.5 text-sm font-medium text-slate-700">Age (years)</Text>
                  <TextInput
                    value={formState.age}
                    onChangeText={(value) => { setFormField('age', value); }}
                    editable={!isSaving}
                    keyboardType="number-pad"
                    placeholder="e.g. 4"
                    placeholderTextColor="#94A3B8"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  />
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium text-slate-700">Size</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {DOG_SIZE_OPTIONS.map((option) => {
                      const isSelected = formState.size === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => { setFormField('size', option.value); }}
                          disabled={isSaving}
                          className={`rounded-full border px-4 py-2 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`text-sm font-semibold ${
                              isSelected ? 'text-indigo-700' : 'text-slate-600'
                            }`}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View>
                  <Text className="mb-1.5 text-sm font-medium text-slate-700">Special Needs</Text>
                  <TextInput
                    value={formState.specialNeeds}
                    onChangeText={(value) => { setFormField('specialNeeds', value); }}
                    editable={!isSaving}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholder="Medication, behavior notes, mobility care..."
                    placeholderTextColor="#94A3B8"
                    className="min-h-[96px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                  />
                </View>

                <View>
                  <Text className="mb-1.5 text-sm font-medium text-slate-700">Photo</Text>
                  <View className="h-32 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    {formState.photoUrl ? (
                      <Image
                        source={{ uri: formState.photoUrl }}
                        className="h-full w-full"
                        contentFit="cover"
                      />
                    ) : (
                      <View className="items-center justify-center">
                        <Ionicons name="image-outline" size={26} color="#64748B" />
                        <Text className="mt-2 text-sm text-slate-500">No photo selected</Text>
                      </View>
                    )}
                  </View>

                  <View className="mt-3 flex-row gap-2">
                    <Pressable
                      onPress={() => {
                        void handlePickPhoto();
                      }}
                      disabled={isModalBusy}
                      className="flex-1 items-center rounded-xl border border-indigo-300 bg-indigo-50 py-2.5 disabled:opacity-60"
                    >
                        <Text className="font-semibold text-indigo-700">
                          {isPickingPhoto ? 'Opening library...' : 'Choose Photo'}
                        </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        void handleOpenCamera();
                      }}
                      disabled={isModalBusy}
                      className="flex-1 items-center rounded-xl border border-emerald-300 bg-emerald-50 py-2.5 disabled:opacity-60"
                    >
                      <Text className="font-semibold text-emerald-700">
                        {isCapturingPhoto ? 'Capturing...' : 'Take Photo'}
                      </Text>
                    </Pressable>

                    {formState.photoUrl ? (
                      <Pressable
                        onPress={handleRemovePhoto}
                        disabled={isSaving}
                        className="items-center rounded-xl border border-slate-300 px-4 py-2.5 disabled:opacity-60"
                      >
                        <Text className="font-semibold text-slate-700">Remove</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  <Text className="mt-2 text-xs text-slate-500">
                    Photos are uploaded and saved for future bookings.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View className="mt-5 flex-row gap-3">
              <Pressable
                onPress={closeModal}
                disabled={isSaving}
                className="flex-1 items-center rounded-xl border border-slate-300 py-3 disabled:opacity-60"
              >
                <Text className="font-semibold text-slate-700">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  void handleSaveDog();
                }}
                disabled={isSaving}
                className="flex-1 items-center rounded-xl bg-primary py-3 disabled:opacity-60"
              >
                <Text className="font-semibold text-white">
                  {isSaving ? 'Saving...' : editingDog ? 'Save Changes' : 'Create Profile'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isCameraOpen} animationType="slide" onRequestClose={closeCameraModal}>
        <View className="flex-1 bg-black">
          <CameraView
            ref={cameraRef}
            className="flex-1"
            facing="back"
            onCameraReady={() => {
              setIsCameraReady(true);
            }}
          />

          <View className="absolute inset-x-0 top-0 bg-black/35 px-6 pb-4 pt-14">
            <Text className="text-center text-lg font-semibold text-white">Take Dog Photo</Text>
            <Text className="mt-1 text-center text-sm text-slate-100">
              Frame your dog and tap capture.
            </Text>
          </View>

          <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-between bg-black/35 px-8 pb-10 pt-6">
            <Pressable
              onPress={closeCameraModal}
              disabled={isCapturingPhoto}
              className="rounded-xl border border-white/60 px-5 py-3 disabled:opacity-60"
            >
              <Text className="font-semibold text-white">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void handleTakePhoto();
              }}
              disabled={!isCameraReady || isCapturingPhoto}
              className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 disabled:opacity-60"
            >
              {isCapturingPhoto ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={30} color="#FFFFFF" />
              )}
            </Pressable>

            <View className="w-16" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
