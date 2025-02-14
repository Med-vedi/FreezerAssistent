// import { api } from '@esgmax/lib.store/api';
// import { useIsAuthenticated } from '../auth';

// export const useUser = (getAlways = true) => {

//     const authenticated = useIsAuthenticated();

//     const { data, isFetching } = api.user.useGetMeQuery(undefined, { skip: !authenticated, pollingInterval: api.POLLING_INTERVAL });

//     if (getAlways) {
//         return data
//     } else {
//         return isFetching ? undefined : data
//     }
// };
