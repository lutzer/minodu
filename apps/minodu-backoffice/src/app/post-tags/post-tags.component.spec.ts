import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTagsComponent } from './post-tags.component';

describe('PostTagsComponent', () => {
  let component: PostTagsComponent;
  let fixture: ComponentFixture<PostTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTagsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
