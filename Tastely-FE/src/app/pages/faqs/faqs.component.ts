import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../faq.service';
import { FAQ } from '../../../faq-model';
import { Observable, combineLatest } from 'rxjs';
import { FormControl, FormsModule } from '@angular/forms';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../pages/footer/footer.component';

@Component({
  selector: 'app-faqs',
  imports: [FormsModule, CommonModule, FooterComponent],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit {
  faqs$!: Observable<FAQ[]>;
  categories$!: Observable<string[]>;
  searchControl = new FormControl('');
  categoryControl = new FormControl('all');
  activeFaqId: number | null = null;
  activeIndex: number | null = null;

  constructor(private faqService: FaqService) { }

  ngOnInit(): void {
    this.categories$ = this.faqService.getCategories();

    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith('all')
    );

    this.faqs$ = combineLatest([
      this.faqService.getAllFaqs(),
      search$,
      category$
    ]).pipe(
      map(([faqs, searchTerm, category]) => {
        let filteredFaqs = [...faqs];

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredFaqs = filteredFaqs.filter(faq =>
            faq.question.toLowerCase().includes(term) ||
            faq.answer.toLowerCase().includes(term)
          );
        }

        if (category && category !== 'all') {
          filteredFaqs = filteredFaqs.filter(faq => faq.category === category);
        }

        return filteredFaqs;
      })
    );
  }

  toggleFaq(faqId: number): void {
    this.activeFaqId = this.activeFaqId === faqId ? null : faqId;
  }

  trackByFaqId(index: number, faq: FAQ): number {
    return faq.id;
  }

  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

}

