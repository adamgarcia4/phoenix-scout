console.log('hello worlds') 

if (module.hot) {
	module.hot.accept()
	module.hot.dispose(() => console.log('Module Disposed. '))
}