// src/app/faqs/faq.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FAQ } from '../faq-model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I submit my own recipe to Tastely?',
      answer: 'You can submit your recipe by clicking on the "Submit Recipe" button in the top navigation. Fill out the form with all the necessary details and click submit.',
      category: 'Recipes',
      lastUpdated: new Date('2023-01-15')
    },
    {
      id: 2,
      question: 'Can I edit a recipe after submitting it?',
      answer: 'Yes, you can edit your recipes by going to your profile page, finding the recipe you want to edit, and clicking the "Edit" button. Note that edits may need to be re-approved by moderators.',
      category: 'Recipes',
      lastUpdated: new Date('2023-02-20')
    },
    {
      id: 3,
      question: 'Are there any restrictions on recipe content?',
      answer: 'We require all recipes to be original or properly attributed. We do not allow inappropriate content, copyrighted material without permission, or spam. All recipes are reviewed before publication.',
      category: 'Content Policy',
      lastUpdated: new Date('2023-03-10')
    },
    {
      id: 4,
      question: 'How can I save recipes to try later?',
      answer: 'You can save recipes by clicking the "Save" button (bookmark icon) on any recipe page. Saved recipes will appear in your profile under "Saved Recipes". You can organize them into collections.',
      category: 'User Features',
      lastUpdated: new Date('2023-04-05')
    },
    {
      id: 5,
      question: 'Is Tastely free to use?',
      answer: 'Yes, Tastely is completely free for all users. We may offer premium features in the future, but the core functionality will always remain free. We support the platform through ads and optional donations.',
      category: 'Account',
      lastUpdated: new Date('2023-05-12')
    },
    {
      id: 6,
      question: 'How do I report an inappropriate recipe or comment?',
      answer: 'Each recipe and comment has a "Report" option (flag icon). Click this to notify our moderators. You can also email us directly at moderation@tastely.com with details.',
      category: 'Content Policy',
      lastUpdated: new Date('2023-06-18')
    },

  {
    "id": 9,
    "question": "How do I change my username or password?",
    "answer": "You can change your account details by going to your 'Account Settings' page in your profile. From there, you can update your username, email, and password. You will be asked to confirm your current password to make changes.",
    "category": "Account",
    "lastUpdated": new Date("2023-09-05")
  },
  {
    "id": 10,
    "question": "Does Tastely have a blog?",
    "answer": "Yes, we have a blog featuring articles on cooking techniques, ingredient spotlights, and interviews with chefs. You can find it by clicking the 'Blog' link in the main navigation menu.",
    "category": "Blogs",
    "lastUpdated": new Date("2023-10-15")
  },
  {
    "id": 11,
    "question": "Is there an AI chatbot to help me with cooking questions?",
    "answer": "Yes! Our AI-powered 'ChefBot' can help you with ingredient substitutions, measurement conversions, and cooking-related queries. You can access it via the chat icon at the bottom right of your screen.",
    "category": "AI Chatbot",
    "lastUpdated": new Date("2023-11-20")
  }
  ];

  private faqSubject = new BehaviorSubject<FAQ[]>(this.faqs);
  public faqs$ = this.faqSubject.asObservable();

  constructor() { }

  // Get all FAQs
  getAllFaqs(): Observable<FAQ[]> {
    // Simulate API delay
    return of(this.faqs).pipe(delay(300));
  }

  // Get FAQs by category
  getFaqsByCategory(category: string): Observable<FAQ[]> {
    return this.getAllFaqs().pipe(
      map(faqs => faqs.filter(faq => faq.category === category))
    );
  }

  // Get all unique categories
  getCategories(): Observable<string[]> {
    return this.getAllFaqs().pipe(
      map(faqs => {
        const categories = new Set(faqs.map(faq => faq.category));
        return Array.from(categories).filter(c => c !== undefined) as string[];
      })
    );
  }

  // Search FAQs by keyword
  searchFaqs(keyword: string): Observable<FAQ[]> {
    if (!keyword.trim()) {
      return this.getAllFaqs();
    }
    const lowerKeyword = keyword.toLowerCase();
    return this.getAllFaqs().pipe(
      map(faqs => faqs.filter(faq => 
        faq.question.toLowerCase().includes(lowerKeyword) || 
        faq.answer.toLowerCase().includes(lowerKeyword)
      ))
    );
  }

  // Get a single FAQ by ID
  getFaqById(id: number): Observable<FAQ | undefined> {
    return this.getAllFaqs().pipe(
      map(faqs => faqs.find(faq => faq.id === id))
    );
  }

  // Add a new FAQ (simulated)
  addFaq(newFaq: Omit<FAQ, 'id'>): Observable<FAQ> {
    const id = Math.max(...this.faqs.map(f => f.id)) + 1;
    const faq: FAQ = {
      id,
      ...newFaq,
      lastUpdated: new Date()
    };
    this.faqs = [...this.faqs, faq];
    this.faqSubject.next(this.faqs);
    return of(faq).pipe(delay(300));
  }

  // Update an existing FAQ (simulated)
  updateFaq(updatedFaq: FAQ): Observable<FAQ> {
    this.faqs = this.faqs.map(faq => 
      faq.id === updatedFaq.id ? { ...updatedFaq, lastUpdated: new Date() } : faq
    );
    this.faqSubject.next(this.faqs);
    return of(updatedFaq).pipe(delay(300));
  }
}