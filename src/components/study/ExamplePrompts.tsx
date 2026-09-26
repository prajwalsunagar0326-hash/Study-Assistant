import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface ExamplePromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  {
    label: 'Java OOP',
    prompt:
      'Object-Oriented Programming in Java: Polymorphism, dynamic method dispatch, encapsulation with access modifiers, interface default methods vs abstract classes, and avoiding the diamond problem.',
  },
  {
    label: 'Machine Learning',
    prompt:
      'Machine Learning Essentials: Supervised vs unsupervised learning, bias-variance tradeoff, overfitting prevention via regularization, gradient descent mechanics, and precision vs recall.',
  },
  {
    label: 'DBMS Normalization',
    prompt:
      'Database Management Systems: Relational normalization through 1NF, 2NF, 3NF, and BCNF, functional dependencies, and ACID transaction isolation guarantees.',
  },
  {
    label: 'Operating Systems',
    prompt:
      'Operating Systems Architecture: Process vs thread execution, CPU scheduling algorithms, virtual memory paging, deadlock prevention conditions, and mutex vs semaphores.',
  },
  {
    label: 'Computer Networks',
    prompt:
      'Computer Networks: OSI 7-layer model vs TCP/IP stack, 3-way TCP handshake, DNS resolution process, HTTP/2 multiplexing, and routing protocols.',
  },
];

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectPrompt, disabled }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted)] mb-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Quick topic inspiration:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(ex.prompt)}
            className="hover-lift glass-stroke-border inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100/90 hover:bg-slate-200/90 dark:bg-[var(--surface-glass)] dark:hover:bg-[var(--surface-hover)] border border-slate-300/80 dark:border-[var(--border)] hover:border-indigo-400 dark:hover:border-indigo-500/50 text-slate-800 dark:text-[var(--foreground)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md hover:shadow-indigo-500/10 active:scale-95"
          >
            <BookOpen className="w-3 h-3 text-indigo-600 dark:text-[var(--primary-light)] group-hover:scale-110 transition-transform" />
            <span>{ex.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
