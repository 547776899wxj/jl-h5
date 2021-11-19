import Request from './request.js'

export default function(data) {
	let request  = new Request(data)
	return request.run()
}