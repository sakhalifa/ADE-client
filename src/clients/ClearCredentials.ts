import { ICredentials } from "../interfaces/ICredentials";

let getConfig = (): ICredentials => {
	return {
		getUsername() {
			return "";
		},
		getPassword() {
			return "";
		}
	}
}

//Stinky...
function createConfig(login: string, password: string){
	getConfig = () => {
		return {
			getUsername() {
				return login
			},
			getPassword() {
				return password
			},
		}
	}
}

export { getConfig, createConfig }