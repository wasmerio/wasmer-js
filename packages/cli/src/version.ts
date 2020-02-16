// @ts-ignore
import pkginfo from 'pkginfo';

export const getVersion = () => {
    return pkginfo(module, 'version').version;
}
