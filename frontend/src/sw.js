import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute'

if ('workbox' in self) {
	precacheAndRoute(self.__WB_MANIFEST)
}