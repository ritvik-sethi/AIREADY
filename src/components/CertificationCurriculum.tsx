import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Download } from 'lucide-react';
import styles from './CertificationCurriculum.module.css';

const curriculumModules = [
  {
    num: '1',
    title: 'Foundations Of Intelligence & AI Evolution',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Understanding natural vs artificial intelligence, AI history from symbolic systems to generative AI, core functional differences between AI/ML/DL, the four pillars of AI systems, and real-world applications.',
    advanced: 'Cognitive science foundations, AI as cognitive amplifier, representation concepts in LLMs, neuro-symbolic AI and hybrid cognition models.'
  },
  {
    num: '2',
    title: 'Data, Information And Intelligence',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Data types and sources, lifecycle management from collection to learning, quality control and bias prevention, cloud infrastructure, and privacy frameworks including India\'s DPDP Act.',
    advanced: 'Information theory and Shannon entropy, embeddings and vector space logic, bias detection methodologies, and global data governance frameworks like GDPR and EU AI Act.'
  },
  {
    num: '3',
    title: 'Machine Learning And Intelligent Learning Theory',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Three learning paradigms (supervised, unsupervised, reinforcement), training and prediction processes, accuracy and generalization concepts, evaluation metrics, and real-world ML applications.',
    advanced: 'Gradient descent and loss minimization, transfer learning and fine-tuning strategies, RLHF (Reinforcement Learning with Human Feedback), and self-supervised learning mechanisms.'
  },
  {
    num: '4',
    title: 'Deep Learning And Neural Networks',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Neural network architectures, layer types and functions, CNNs for vision, RNNs for sequences, Transformers for language, attention mechanisms, and deep learning challenges.',
    advanced: 'Activation functions and gradient flow, attention heads and positional encoding, explainable AI techniques (LIME, SHAP, Grad-CAM), and optimization methods.'
  },
  {
    num: '5',
    title: 'Generative AI - Theory, Architectures And Creativity',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Generative AI fundamentals, core architectures (GANs, VAEs, Diffusion, LLMs), tokenization and context windows, creativity control parameters, and real-world generative tools.',
    advanced: 'Probability sampling and latent space exploration, model fine-tuning ethics, prompt compression techniques, and understanding creativity boundaries in AI systems.'
  },
  {
    num: '6',
    title: 'Multimodal AI Systems And Tool Integration',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Cross-modal generation (text-to-image, text-to-audio, text-to-video), integration tools and platforms, API workflows, and end-to-end content creation pipelines.',
    advanced: 'Multimodal model architectures, RAG (Retrieval-Augmented Generation) systems, performance optimization and latency management, API security and fairness considerations.'
  },
  {
    num: '7',
    title: 'AI Strategy, Business Innovation And Transformation',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'AI applications across industries, ROI measurement and KPIs, human-AI collaboration workflows, building AI-ready teams, and managing organizational change.',
    advanced: 'AI maturity frameworks, governance boards and ethical decision processes, economic impact analysis, and AI in Industry 5.0 human-centered automation.'
  },
  {
    num: '8',
    title: 'Ethics, Risks, And Global Governance',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Core AI ethics (bias, fairness, transparency, privacy), deepfakes and disinformation challenges, intellectual property considerations, and responsible AI principles.',
    advanced: 'Global regulatory frameworks (EU AI Act, DPDP, US AI Bill of Rights), algorithmic accountability and AI audits, environmental impact, and the alignment problem.'
  },
  {
    num: '9',
    title: 'Human AI Collaboration And Future Leadership',
    desc: 'Build A Solid Conceptual Base Is What Intelligence Is - And How AI Simulates It',
    professional: 'Human-in-the-loop systems, AI for creativity and decision-making, AI literacy for different roles, and reskilling frameworks for the AI economy.',
    advanced: 'Affective computing and emotional AI, synthetic labor and digital twins, philosophy of human-AI coexistence, and leadership ethics in algorithmic governance.'
  },
];

export default function CertificationCurriculum() {
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState<number | null>(null);

  const toggleModule = (index: number) => {
    setOpenModule(openModule === index ? null : index);
  };

  return (
    <section id="curriculum" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.gradientText}>Certification</span> <span className={styles.titleBlack}>Curriculum</span>
          </h2>
          <p className={styles.description}>
            A Professionally Designed 9-Module Program Covering AI Foundations To Advanced Implementation
          </p>
        </div>

        <div className={styles.modulesList}>
          {curriculumModules.map((module, index) => (
            <div
              key={index}
              className={`${styles.moduleCard} ${
                openModule === index ? styles.moduleCardOpen : ''
              }`}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(index)}
                className={styles.moduleButton}
              >
                {/* Number Badge with Glow Effect */}
                <div className={styles.badgeWrapper}>
                  <div className={styles.badgeGlow}></div>
                  <div className={styles.badgeNumber}>
                    {module.num}
                  </div>
                </div>

                {/* Content */}
                <div className={styles.moduleContent}>
                  <h3 className={styles.moduleTitle}>
                    {module.title}
                  </h3>
                  <p className={styles.moduleDesc}>
                    {module.desc}
                  </p>
                </div>

                {/* Expand Icon */}
                <div className={styles.expandIconWrapper}>
                  <ChevronDown
                    className={`${styles.chevronIcon} ${
                      openModule === index ? styles.chevronIconOpen : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expandable Content */}
              {openModule === index && (
                <div className={styles.expandedContent}>
                  <div className={styles.topicsContainer}>
                    <h4 className={styles.topicsTitle}>
                      <div className={styles.topicsDot}></div>
                      Topics Covered
                    </h4>
                    <div className={styles.topicsList}>
                      {/* Professional Topics */}
                      <div className={styles.topicSection}>
                        <h5 className={styles.topicSectionTitle}>Professional Concepts</h5>
                        <p className={styles.topicSectionText}>
                          {module.professional}
                        </p>
                      </div>

                      {/* Advanced Topics */}
                      <div className={styles.topicSection}>
                        <h5 className={styles.topicSectionTitleAdvanced}>Advanced Integration</h5>
                        <p className={styles.topicSectionText}>
                          {module.advanced}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <div className={styles.ctaContainer}>
          <button
            onClick={() => navigate('/register')}
            className={styles.ctaButton}
          >
            <span>Download Full Curriculum</span>
            <Download className={styles.ctaIcon} />
          </button>
        </div>
      </div>
    </section>
  );
}

