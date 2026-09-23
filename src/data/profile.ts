export const profile = {
  name: "Mingrui Liang",
  email: "mliang17@jh.edu",
  cvUrl: "/cv/",
  github: "https://github.com/RuiRuihigh",
  scholar: "https://scholar.google.com/citations?user=L3XEWtwAAAAJ&hl=en",
};
export const publications = [
  {
    id: "deepfake", year: 2026, label: "SPSC 2026 · Accepted", topic: "Audio security",
    title: "Leveraging Gradient Reversal Loss and Multitask Learning for Datasets-Aware Audio Deepfake Detection",
    authors: ["Mingrui Liang", "Thomas Thebaud", "Lukasz Wojciak", "Laureano Moro Velazquez", "Yishay Carmiel", "Jesus Villalba Lopez", "Najim Dehak"],
    summary: "Using dataset identity as supervision to improve audio deepfake detection across heterogeneous datasets, through multitask learning and gradient reversal.",
    url: "https://arxiv.org/abs/2607.23961", pdf: "https://arxiv.org/pdf/2607.23961", equal: false,
    links: [{label: "Code", url: "https://github.com/RuiRuihigh/hyperion-deepfake-multitask/tree/deepfake-multitask-grl/egs/deepfake_detect"}],
  },
  {
    id: "contratalk", year: 2026, label: "arXiv 2026 · Preprint", topic: "Audio-grounded reasoning",
    title: "When Text Misleads: Inconsistent-Aware Reasoning for Audio-Grounded Dialogue",
    authors: ["Yen-Ju Lu", "Yuzhe Wang", "Yaohan Guan", "Xiluo He", "Jiarui Hai", "Mingrui Liang", "Kaavya Chaparala", "Thomas Thebaud", "Laureano Moro-Velazquez", "Najim Dehak", "Jesus Villalba"],
    summary: "ContraTalk tests where transcripts and vocal cues disagree. The Audio Twin framework exposes acoustic evidence to help models reason beyond the words alone.",
    url: "https://arxiv.org/abs/2608.27176", pdf: "https://arxiv.org/pdf/2608.27176", equal: false, links: [],
  },
  {
    id: "dialogsum", year: 2025, label: "arXiv 2025 · Preprint", topic: "Spoken dialogue",
    title: "Spoken DialogSum: An Emotion-Rich Conversational Dataset for Spoken Dialogue Summarization",
    authors: ["Mingrui Liang*", "Yen-Ju Lu*", "Kunxiao Gao*", "Helin Wang", "Thomas Thebaud", "Laureano Moro-Velazquez", "Najim Dehak", "Jesús Villalba"],
    summary: "13,460 expressive dialogues pairing speech with factual and emotion-rich summaries, designed to study how audio-language models understand conversations.",
    url: "https://arxiv.org/abs/2512.14687", pdf: "https://arxiv.org/pdf/2512.14687", equal: true,
    links: [{label: "Demo", url: "https://spokendialogsum.github.io/SpokenDialog-Sum-Audio-Samples/"}],
  },
];
export const projects = [
  { title: "Phonological tokenization for speech language models", period: "Jun 2026 — Present", institution: "Carnegie Mellon University", supervisor: "Shinji Watanabe", text: "Investigating whether phonologically informed discrete tokens can improve VoxTLM. Replacing its HuBERT and k-means speech tokenizer with a phonological tokenizer and evaluating the effect on discrete-token speech language modeling.", tags: ["VoxTLM", "Discrete speech tokens", "Phonological tokenizer"], result: "Beyond HuBERT + k-means" },
  { title: "Multi-speaker speech synthesis", period: "Jun 2026 — Present", institution: "Carnegie Mellon University", supervisor: "Shinji Watanabe", text: "Building multi-speaker TTS on DailyTalk with speaker-conditioned VITS. Contributed a training recipe to ESPnet and released a model through the ESPnet Hugging Face repository.", tags: ["VITS", "ESPnet", "Text-to-speech"], result: "3.79 UTMOS", url: "https://github.com/RuiRuihigh/espnet/tree/add-dailytalk-tts-recipe", linkLabel: "ESPnet fork" },
  { title: "LLM-based speech recognition", period: "Sep — Dec 2025", institution: "Johns Hopkins University", text: "Built an end-to-end speech recognition system combining an audio encoder with an LLM through cross-modal representation alignment. Used staged training with a frozen encoder, Q-Former alignment, and LoRA fine-tuning to preserve learned representations and improve audio-text fusion.", tags: ["Audio encoder", "Q-Former", "LoRA"], result: "2.9% WER on LibriSpeech" },
  { title: "Multimodal speech emotion recognition", period: "Sep — Dec 2024", institution: "Johns Hopkins University", text: "Built a robust multimodal emotion recognition system on MELD, augmenting speech with MUSAN noise and room impulse responses. Compared feature fusion methods combining wav2vec 2.0 acoustic representations with ASR and BERT text features.", tags: ["wav2vec 2.0", "ASR + BERT", "Multimodal fusion"], result: "58.9% five-class accuracy" },
  { title: "Interactive singing voice conversion", period: "May — Sep 2023", institution: "CUHK-Shenzhen", supervisor: "Zhizheng Wu", text: "Adapted a diffusion-based singing voice conversion model and built an interactive D3.js interface for exploring intermediate mel-spectrograms and synthesized audio.", tags: ["Diffusion", "PyTorch", "D3.js"], result: "From diffusion steps to sound", url: "https://ruiruihigh.github.io/Webpage_Demo/", linkLabel: "Interactive demo" },
];
export const education = [
  { school: "Johns Hopkins University", degree: "M.S. in Electrical and Computer Engineering", date: "2024 — 2026", detail: "GPA 4.0 / 4.0 · Research with Najim Dehak", place: "Baltimore, MD" },
  { school: "The Chinese University of Hong Kong, Shenzhen", degree: "B.S. in Computer Science and Engineering", date: "2020 — 2024", detail: "Dean’s List 2022–23 · Research with Zhizheng Wu", place: "Shenzhen, China" },
];
export const experience = [
  { role: "Software Engineer Intern", company: "UpSite Clinical", date: "May — Aug 2025", text: "Built Kafka messaging infrastructure with Protobuf, Schema Registry, and AWS MSK for reliable communication between software services." },
  { role: "Software Developer Intern", company: "Hoperun Technology", date: "Jun — Aug 2024", text: "Developed a production inspection pipeline using YOLOv8 and PaddleSeg to detect missing welds in X-ray images of electronic boards." },
  { role: "Teaching Assistant · Database Management", company: "CUHK-Shenzhen", date: "Feb — May 2024", text: "Led tutorials, held office hours, and supported assessment in relational database design, SQL, and transaction management." },
];
