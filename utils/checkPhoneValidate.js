export default (phone) => {
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

    return phoneRegex.test(phone);
}