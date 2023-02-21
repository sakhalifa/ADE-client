import { IGWTConfig } from "../interfaces/IGWTConfig";


function getConfig(): IGWTConfig {
    return {
        getModuleBase() {
            return "https://ade.bordeaux-inp.fr/direct/gwtdirectplanning/";
        },
        getPermutation() {
            return "B6FB4BD1F96498A84974F1F52B318B82";
        }
    }
}

export {
    getConfig
};