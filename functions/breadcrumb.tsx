export const generateBreadcrumbItems = (asPath: string) => {
    const pathSegments = asPath.split('/').filter(segment => segment !== '');
    let currentPath = '';

    return pathSegments.slice(0, pathSegments.length - 1).map((segment, index) => {
        if(index + 1 == pathSegments.length - 1) {
            return {
                label: segment,
                url: asPath
            };
        } else {
            currentPath += `/${segment}`;
            return {
                label: segment,
                url: currentPath
            };
        }
    });
};