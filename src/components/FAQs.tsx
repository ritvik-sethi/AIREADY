import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQs.module.css';

const faqData = {
  0: [
    {
      question: 'What is The ET AI Ready Certification?',
      answer: 'The ET AI Ready Certification is a globally recognized credential backed by The Economic Times, designed to validate your AI expertise and prepare you for leadership in the AI-driven future.'
    },
    {
      question: 'Who is this Certification For?',
      answer: 'This certification is perfect for professionals, students, business leaders, and organizations seeking to demonstrate AI competency. No prior AI experience is required—just a high school diploma (10+2).'
    },
    {
      question: 'What makes this certification globally recognized?',
      answer: 'The certification is backed by The Economic Times, one of India\'s most trusted business publications with global credibility. It follows internationally recognized AI competency frameworks and is accepted by leading organizations worldwide.'
    }
  ],
  1: [
    {
      question: 'What are the eligibility requirements?',
      answer: 'The only requirement is a high school diploma (10+2 or equivalent). No prior AI experience or technical background is necessary. The program is designed to accommodate learners from all backgrounds.'
    },
    {
      question: 'Do I need programming knowledge?',
      answer: 'No programming knowledge is required. The certification focuses on AI concepts, applications, ethics, and strategic implementation rather than coding skills.'
    }
  ],
  2: [
    {
      question: 'How is The Exam Conducted?',
      answer: 'The exam is conducted online with AI-powered proctoring. It consists of 100 questions to be completed in 60 minutes, with a passing score of 70%. You can take the exam from anywhere with a stable internet connection.'
    },
    {
      question: 'What Happens If I Fail The Exam?',
      answer: 'You get three attempts to pass the exam. If you don\'t pass on your first attempt, you can retake the exam after a waiting period. Additional study resources will be provided to help you succeed.'
    }
  ],
  3: [
    {
      question: 'What is the certification fee?',
      answer: 'The certification fee is ₹15,000, which includes the exam, certificate, and digital badge. This is a one-time payment with no recurring fees.'
    },
    {
      question: 'How long is the certification valid?',
      answer: 'The certification is valid for 3 years from the date of issue. After this period, you can renew your certification to stay current with evolving AI technologies.'
    }
  ]
};

const categories = [
  'Certification Overview',
  'Eligibility and Requirements',
  'Exam and Assessment',
  'Pricing and Support'
];

export default function FAQs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqCategory, setFaqCategory] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFaqCategory = (category: number) => {
    setFaqCategory(category);
    setOpenFaq(null); // Close any open FAQ when switching categories
  };

  const currentFaqs = faqData[faqCategory as keyof typeof faqData] || [];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.titleText}>ET AI Ready Certification </span>
            <span className={styles.gradientText}>FAQs</span>
          </h2>
          <p className={styles.subtitle}>
            Find Answers To Common Questions About AI Certification
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Sidebar - Categories */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleFaqCategory(index)}
                  className={`${styles.categoryButton} ${
                    faqCategory === index ? styles.categoryButtonActive : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content - FAQ Items */}
          <div className={styles.faqContent}>
            {currentFaqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  onClick={() => toggleFaq(index)}
                  className={styles.faqButton}
                >
                  <span className={styles.faqQuestion}>{faq.question}</span>
                  <ChevronDown
                    className={`${styles.chevronIcon} ${
                      openFaq === index ? styles.chevronIconOpen : ''
                    }`}
                    style={{color: openFaq === index ? '#dc2626' : '#64748b'}}
                  />
                </button>
                {openFaq === index && (
                  <div className={styles.faqAnswer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

