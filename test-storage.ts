import { useStorage } from '#imports'
async function test() {
  const data = await useStorage('assets:server').getItem('BE.txt');
  console.log(data ? data.slice(0, 50) : 'not found');
}
test();
