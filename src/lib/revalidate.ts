import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateTagsAfterChange = (...tags: string[]): CollectionAfterChangeHook => ({ doc }) => {
  for (const t of tags) revalidateTag(t, 'max')
  return doc
}
export const revalidateTagsAfterDelete = (...tags: string[]): CollectionAfterDeleteHook => ({ doc }) => {
  for (const t of tags) revalidateTag(t, 'max')
  return doc
}
