
import { atom } from 'recoil';
import { IBulkUser } from '../hooks/useGetBulkUsersDetails';

const bulkUserAtom = atom<IBulkUser[]>({
    key: 'bulkUserAtom',
    default: [],
});

export default bulkUserAtom;