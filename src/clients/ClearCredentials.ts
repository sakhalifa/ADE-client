import { ICredentials } from "../interfaces/ICredentials";

function getConfig(login: string, password: string): ICredentials {
	return {
		getUsername() {
			return login;
		},
		getPassword() {
			return password;
		}
	}
}

export { getConfig }