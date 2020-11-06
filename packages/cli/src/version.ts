// @ts-ignore
import pkginfo from 'pkginfo';

export const getVersion = () => {
    return pkginfo.find(module).version;
}
