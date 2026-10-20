# 赵炳杰 / BJ1919810

数据科学与大数据技术 @ 华南理工大学（2023–2027）· 广州

把大模型的链路拆开重装（训练 / 语音 / 多模态），也从零写引擎和工具。

个人站：<https://bj1919810.github.io>

## 最近在做的

- **v4mini-0.5B** — 从零实现的 0.5B 稀疏（MoE）小模型：模型结构、CSA 注意力、MoE 路由、优化器与训练循环全部自写，目标是把 DeepSeek 的稀疏结构在 8 GB 显存的 3070 上跑通训练。
- **Protocol_Remake** — C++ 自研 3D 引擎与都市开放世界动作原型：自建 RHI 抽象层（bgfx / OpenGL）、单元格流式加载、像素级 golden 帧判据，17 个无头套件 / 227 用例。
- **云卡生图** — 云 GPU（AutoDL）+ ComfyUI 出图工具链：SSH 隧道 CLI、安卓 App、LoRA 训练，MIT 许可。

## 选做项目

| 项目 | 一句话 | 技术 |
| --- | --- | --- |
| [Movie-trans](https://github.com/BJ1919810/Movie-trans) | 端到端视频配音翻译：人声分离 → 说话人分离 → ASR → 大模型翻译 → 音色克隆配音 → 回封，多语种 | pyannote · Faster-Whisper · IndexTTS-2.5 |
| [Web_gal](https://github.com/BJ1919810/Web_gal) | 纳西妲 Live2D 对话伴侣：普通 / Agent 双模式，本地检索与长期记忆 | Flask · DeepSeek · GPT-SoVITS · ONNX |
| [yunka-shengtu](https://github.com/BJ1919810/yunka-shengtu) | 云卡出图工具链（CLI + Android + LoRA 训练） | Python · ComfyUI · Kotlin |
| [Moibi](https://github.com/BJ1919810/Moibi) | AI 辅助长篇小说创作：上下文编译器 + 状态账本，Web / Android 双端 | JavaScript · Capacitor |
| [SchedulingChargingBot](https://github.com/WhythZ/SchedulingChargingBot/) | 充电机器人调度策略对比与 SDL2 实时可视化 | C++ · SDL2 |
| [ReadingWBW](https://github.com/BJ1919810/ReadingWBW) | 纯离线中文 TXT 逐字变色朗读器，可打包成单文件 exe | Python · Tkinter · TTS |
| [dsh-rea](https://github.com/BJ1919810/dsh-rea) | DeepSeek Harness 插件：一个开关挂上 207 个逆向工具 | JavaScript · MCP |
| [dsh-notify](https://github.com/BJ1919810/dsh-notify) | 任务结束推 Windows 通知，点通知直接跳回对应会话 | JavaScript |

## 技术栈

- **语言**：Python · C++ · C# · JavaScript · Kotlin · SQL
- **模型与训练**：PyTorch · Transformers / HuggingFace · ms-swift / LoRA · ONNX Runtime · ComfyUI
- **语音与多模态**：Faster-Whisper · FunASR · pyannote · UVR5 · GPT-SoVITS · IndexTTS
- **工程与部署**：Linux · Docker · Git · Flask · CMake / MSVC
- **图形与前端**：bgfx / OpenGL · SDL2 · three.js · Live2D · Capacitor

## 写作

《甲壳虫也能轻松看懂的 DeepSeek 架构》——写给第一次接触大模型内部结构的人，全程只用三个比喻（图书馆 / 专家门诊 / 草稿纸）讲清 MoE 与注意力为什么能省算力：每节先讲「像什么」，再给一段真身（公式、配置口径，以及本机复刻代码的 `文件:行` 落点）。共 10 节，全文尚未公开上线，可来信索取。

## 其他

- 个人站：<https://bj1919810.github.io>
- B 站：<https://space.bilibili.com/399764550>
- 邮箱：<3054819975@qq.com>
