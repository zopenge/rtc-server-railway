(function() {
    const gameConfig = {
        duelCards: {
            name: '卡牌对决',
            description: '策略性卡牌对战游戏',
            iconId: 'game-cards'
        }
    };

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
        },
        welcome: {
            title: "欢迎使用我们的平台",
            subtitle: "探索我们强大的功能和工具",
            features: {
                1: {
                    title: "文件管理",
                    text: "在一处安全地上传、存储和管理您的文件"
                },
                2: {
                    title: "实时协作",
                    text: "与团队成员实时协作"
                },
                3: {
                    title: "跨平台支持",
                    text: "随时随地从任何设备访问您的内容"
                }
            }
        },
        workspace: {
            sidebar: {
                title: "导航",
                files: "我的文件",
                shared: "共享文件",
                recent: "最近使用"
            },
            actions: {
                upload: "上传文件",
                collaborate: "开始协作",
                refresh: "刷新",
                settings: "设置"
            },
            nav: {
                tasks: "任务",
                history: "历史",
                games: "游戏"
            },
            tasks: {
                available: "可用任务",
                processing: "处理中",
                completed: "已完成",
                priority: "优先级",
                deadline: "截止日期"
            },
            games: {
                title: "游戏中心"
            }
        },
        auth: {
            loginTab: "登录",
            registerTab: "注册",
            username: "用户名",
            password: "密码",
            loginButton: "登录",
            registerButton: "注册",
            confirmPassword: "确认密码"
        }
    };

    // Register with i18n system
    i18n.register('zh', zhTranslations);
    i18n.registerGames(gameConfig);
})();