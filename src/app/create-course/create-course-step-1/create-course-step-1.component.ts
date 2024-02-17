import {Component} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {MatCalendarCellClassFunction} from "@angular/material/datepicker";


@Component({
  selector: "create-course-step-1",
  templateUrl:"create-course-step-1.component.html",
  styleUrls: ["create-course-step-1.component.scss"]
})
export class CreateCourseStep1Component {

  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    releasedAt: [new Date(), Validators.required],
    category: ['BEGINNER', Validators.required],
    courseType: ['premium', Validators.required],
    downloadsAllowed: [false, Validators.requiredTrue],
    longDescription: ['', [Validators.required, Validators.minLength(3)]]
  });

  protected dateClass: MatCalendarCellClassFunction<Date> = (cell, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cell.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 ? 'highlight-date' : '';
    }

    return '';
  }

  constructor(private fb: UntypedFormBuilder) {

  }
  get courseTitle() {
    return this.form.controls['title'];
  }

}
