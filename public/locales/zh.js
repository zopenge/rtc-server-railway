// Chinese (Simplified) translations
const zhTranslations = {
    nav: {
        login: '登录',
        register: '注册'
    },
    login: {
        title: '用户登录',
        email: '邮箱',
        password: '密码',
        submit: '登录',
        registerPrompt: '还没有账号？',
        registerLink: '立即注册'
    },
    register: {
        title: '用户注册',
        email: '邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        submit: '注册',
        loginPrompt: '已有账号？',
        loginLink: '立即登录'
    },
    validation: {
        required: '此字段为必填项',
        emailInvalid: '请输入有效的邮箱地址',
        passwordLength: '密码长度必须至少为6个字符',
        passwordMismatch: '两次输入的密码不匹配'
    },
    errors: {
        loginFailed: '登录失败，请检查邮箱和密码',
        registerFailed: '注册失败，请稍后重试',
        networkError: '网络错误，请检查网络连接'
    },
    upload: {
        dropzone: "拖放文件到这里或点击选择",
        compressing: "正在压缩文件...",
        uploading: "正在上传...",
        success: "上传成功！",
        failed: "上传失败：{error}"
    }
};

// Register Chinese translations with i18n system
i18n.register('zh', zhTranslations); 