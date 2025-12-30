import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
})
export class Footer {

  activeFaqIndex: number | null = null;

  faqs = [
    {
      question: 'How often is content updated?',
      answer:
        'We publish new articles regularly. Check back often for the latest insights and stories.',
    },
    {
      question: 'How do I submit a comment?',
      answer:
        'You can leave comments directly on any blog post. Simply scroll to the comments section and share your thoughts.',
    },
    {
      question: 'Is there an RSS feed?',
      answer:
        'Yes, you can subscribe to our RSS feed to get updates on new articles automatically.',
    },
  ];

  toggleFaq(index: number) {
    this.activeFaqIndex =
      this.activeFaqIndex === index ? null : index;
  }
    get activeAnswer() {
    return this.activeFaqIndex !== null
      ? this.faqs[this.activeFaqIndex].answer
      : null;
  }
  categories = ['News', 'Business', 'Politics','Sports', 'Entertainment', 'Tech'];

  constructor(private router: Router) {}

 filterByCategory(category: string) {
    this.router.navigate(['/home'], {
      queryParams: { category }
    });
  }
}
