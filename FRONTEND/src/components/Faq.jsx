import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Is my uploaded APK private?",
    answer:
      "Yes, your privacy is our top priority. All uploaded files are encrypted in transit and at rest. Files are automatically deleted after analysis. We never store, share, or analyze your APK files beyond the security scan.",
  },
  {
    question: "Can I scan APK files from any source?",
    answer:
      "Yes, you can scan APK files from any source including app stores, direct downloads, email attachments, or files shared via messaging apps.",
  },
  {
    question: "What type of threats can SecureAPK detect?",
    answer:
      "SecureAPK goes beyond basic malware detection. It identifies banking trojans, spyware, adware, rootkits, fake and malicious apps, as well as suspicious permissions and obfuscation techniques. Our system also uses SHA-256 integrity checks, permission risk analysis, and review–rating correlation to flag potentially harmful apps. Additionally, SecureAPK runs apps in a controlled sandbox environment to analyze runtime behavior, ensuring a holistic and reliable mobile threat detection process.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#0A1B2B] text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked <span className="text-cyan-400">Questions</span>
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#12263C] rounded-lg shadow-md p-4 cursor-pointer"
            onClick={() => toggleFaq(index)}
          >
            <div className=" transition-all duration-300 flex justify-between items-center">
              <h3 className="font-semibold">{faq.question}</h3>
              {openIndex === index ? (
                <i className="transition-all duration-200 ri-arrow-up-wide-line text-cyan-400" />
              ) : (
                <i className="transition-all duration-200 ri-arrow-down-wide-line text-cyan-400" />
              )}
            </div>
            {openIndex === index && (
              <p className="transition-all duration-200 mt-3 text-gray-300">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
