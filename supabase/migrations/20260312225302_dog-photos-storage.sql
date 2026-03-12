insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'dog-photos',
  'dog-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'dog photos public read'
  ) then
    create policy "dog photos public read"
      on storage.objects
      for select
      to public
      using (bucket_id = 'dog-photos');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'dog photos insert own folder'
  ) then
    create policy "dog photos insert own folder"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'dog-photos'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'dog photos update own folder'
  ) then
    create policy "dog photos update own folder"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'dog-photos'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
      with check (
        bucket_id = 'dog-photos'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'dog photos delete own folder'
  ) then
    create policy "dog photos delete own folder"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'dog-photos'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end
$$;
