import { ResponseUsers } from "./responseUsers";

export interface ResponseAllUsers{
    page: number;
    lastPage: number;
    limit: number;
    total: number;
    dataResponse: ResponseUsers[]
}