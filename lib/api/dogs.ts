import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ImagePickerAsset } from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

export type DogSize = 'small' | 'medium' | 'large' | 'extra_large';

export interface Dog {
  id: string;
  owner_id: string;
  name: string;
  breed: string | null;
  age: number | null;
  size: DogSize | null;
  special_needs: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDogInput {
  name: string;
  breed: string | null;
  age: number | null;
  size: DogSize | null;
  special_needs: string | null;
  photo_url: string | null;
}

export interface UpdateDogInput extends CreateDogInput {
  id: string;
}

const DOG_PHOTO_BUCKET = 'dog-photos';

function getExtension(fileName: string | null | undefined, mimeType: string | null | undefined): string {
  const byName = fileName?.includes('.') ? fileName.split('.').pop()?.toLowerCase() : undefined;
  const byType = mimeType?.includes('/') ? mimeType.split('/').pop()?.toLowerCase() : undefined;
  return byName || byType || 'jpg';
}

async function listDogs(ownerId: string): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select(
      'id, owner_id, name, breed, age, size, special_needs, photo_url, created_at, updated_at',
    )
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Dog[];
}

async function createDog(ownerId: string, input: CreateDogInput): Promise<void> {
  const { error } = await supabase.from('dogs').insert({
    owner_id: ownerId,
    name: input.name,
    breed: input.breed,
    age: input.age,
    size: input.size,
    special_needs: input.special_needs,
    photo_url: input.photo_url,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function updateDog(ownerId: string, input: UpdateDogInput): Promise<void> {
  const { error } = await supabase
    .from('dogs')
    .update({
      name: input.name,
      breed: input.breed,
      age: input.age,
      size: input.size,
      special_needs: input.special_needs,
      photo_url: input.photo_url,
    })
    .eq('id', input.id)
    .eq('owner_id', ownerId);

  if (error) {
    throw new Error(error.message);
  }
}

async function deleteDog(ownerId: string, dogId: string): Promise<void> {
  const { error } = await supabase.from('dogs').delete().eq('id', dogId).eq('owner_id', ownerId);

  if (error) {
    throw new Error(error.message);
  }
}

async function uploadDogPhoto(ownerId: string, asset: ImagePickerAsset): Promise<string> {
  const response = await fetch(asset.uri);
  if (!response.ok) {
    throw new Error('Unable to read the selected image.');
  }

  const contentType = asset.mimeType ?? 'image/jpeg';
  const extension = getExtension(asset.fileName, asset.mimeType);
  const imageBuffer = await response.arrayBuffer();
  const filePath = `${ownerId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(DOG_PHOTO_BUCKET).upload(filePath, imageBuffer, {
    contentType,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(DOG_PHOTO_BUCKET).getPublicUrl(filePath);
  if (!data.publicUrl) {
    throw new Error('Uploaded image URL could not be generated.');
  }

  return data.publicUrl;
}

export function useDogs(ownerId: string | null) {
  return useQuery({
    queryKey: ['dogs', ownerId],
    queryFn: () => listDogs(ownerId ?? ''),
    enabled: !!ownerId,
  });
}

export function useCreateDog(ownerId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDogInput) => {
      if (!ownerId) {
        throw new Error('Owner session is required to create a dog profile.');
      }
      await createDog(ownerId, input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dogs', ownerId] });
    },
  });
}

export function useUpdateDog(ownerId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateDogInput) => {
      if (!ownerId) {
        throw new Error('Owner session is required to update a dog profile.');
      }
      await updateDog(ownerId, input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dogs', ownerId] });
    },
  });
}

export function useDeleteDog(ownerId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dogId: string) => {
      if (!ownerId) {
        throw new Error('Owner session is required to delete a dog profile.');
      }
      await deleteDog(ownerId, dogId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dogs', ownerId] });
    },
  });
}

export function useUploadDogPhoto(ownerId: string | null) {
  return useMutation({
    mutationFn: async (asset: ImagePickerAsset) => {
      if (!ownerId) {
        throw new Error('Owner session is required to upload a dog photo.');
      }

      return uploadDogPhoto(ownerId, asset);
    },
  });
}
