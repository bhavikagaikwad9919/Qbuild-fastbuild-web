import history from '@history';

export function navigateTo(path) {
    history.push({
        pathname: path
    });
}