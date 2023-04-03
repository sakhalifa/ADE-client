import axios, { AxiosInstance } from "axios";
import { ICredentials } from "../interfaces/ICredentials";
import { getConfig } from "./ClearCredentials"; // You can use your own credentials provider

axios.defaults.withCredentials = true;


function createClient(login: string, password: string) {
    const config: ICredentials = getConfig(login, password);
    let connectionPayload: { username: string, password: string, execution: string, _eventId: string, lt?: string, submit?: string; }
        = {
            username: config.getUsername(),
            password: config.getPassword(),
            execution: "",
            _eventId: "submit"
        };
    return {
        async connect(service: string, client: AxiosInstance) {
            const response = await client.get(service);
            let loginUrl = "";
            try {
                // Replace '?' by ';${adeCookie}?' in the url
                const regex = /<form id="fm1" class="fm-v clearfix" action="(.+?)" method="post">/g;

                loginUrl = "https://cas.bordeaux-inp.fr" + regex.exec(response.data)![1];

                connectionPayload = {
                    username: config.getUsername(),
                    password: config.getPassword(),
                    lt: "",
                    execution: "",
                    _eventId: "submit",
                    submit: "",
                };

                const ltRegex = /<input type="hidden" name="lt" value="(.*)" \/>/;
                const executionRegex =
                    /<input type="hidden" name="execution" value="(.*)" \/>/;
                const submitRegex = /<input .* name="submit" .* value="(.*?)"/;

                // Run regex on response
                const lt = ltRegex.exec(response.data);
                const execution = executionRegex.exec(response.data);
                const submit = submitRegex.exec(response.data);

                if (lt && execution && submit) {
                    connectionPayload.lt = lt[1];
                    connectionPayload.execution = execution[1];
                    connectionPayload.submit = submit[1];
                } else {
                    throw new Error("Could not find lt, execution or submit in response");
                }
            } catch (e) {
                loginUrl = "https://cas.bordeaux-inp.fr/login";

                connectionPayload = {
                    username: config.getUsername(),
                    password: config.getPassword(),
                    execution: "",
                    _eventId: "submit",
                };
                const executionRegex =
                    /<input type="hidden" name="execution" value="(.[^>]+)"\/>/g;

                // Run regex on response
                const execution = executionRegex.exec(response.data);
                if (execution) {
                    connectionPayload.execution = execution[1];
                } else {
                    throw new Error("Could not find lt, execution or submit in response");
                }
            }


            await client.post(loginUrl, connectionPayload, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
        }
    };
}

export { createClient };