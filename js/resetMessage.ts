
const resetMessage = (options: any) => {
    const ElMessage = window['ElMessage'];
    ElMessage({
        ...options,
        grouping: true
    });
};

['error', 'success', 'info', 'warning'].forEach(type => {
    resetMessage[type] = (options: any) => {
        if (typeof options === 'string') {
            options = {
                message: options
            }
        }
        options.type = type
        return resetMessage(options)
    }
})

export {
    resetMessage
}