import { readdirSync, removeSync } from 'fs-extra';
import { userDataPath } from '../environment-remote';

export function getServicePartitionsDirectory(...segments: string[]) {
  return userDataPath('Partitions', ...[segments].flat());
}

export function removeServicePartitionDirectory(
  id = '',
  addServicePrefix = false,
) {
  // const servicePartition = getServicePartitionsDirectory(
  //   `${addServicePrefix ? 'service-' : ''}${id}`,
  // );
  // return removeSync(servicePartition);
  return true
}

export async function getServiceIdsFromPartitions() {
  console.log(getServicePartitionsDirectory(), 'ddd')
  // const files = readdirSync(getServicePartitionsDirectory());
  // return files.filter(n => n !== '__chrome_extension');
  return []
}
