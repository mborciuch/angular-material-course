import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {merge, fromEvent, throwError} from "rxjs";
import {Lesson} from "../model/lesson";
import {SelectionModel} from "@angular/cdk/collections";


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator)
  matPaginator: MatPaginator;

  @ViewChild(MatSort)
  matSort: MatSort

  course: Course;
  displayedColumns: string[] = ['select', 'seqNo', 'description', 'duration']

  lessons: Lesson[];

  isLoading: boolean = false;
  expandedLesson: Lesson = null;

  selection: SelectionModel<Lesson> = new SelectionModel<Lesson>(true, []);

  constructor(private route: ActivatedRoute,
              private coursesService: CoursesService) {

  }

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.loadDataFromServer();

  }

  ngAfterViewInit() {
    this.matSort.sortChange.subscribe((value: Sort) => this.matPaginator.pageIndex = 0)

    merge(this.matSort.sortChange, this.matPaginator.page)
    .pipe().subscribe(result => {
      this.loadDataFromServer();
    });

  }

  toggleLesson(lesson: Lesson){
    if(lesson === this.expandedLesson){
      this.expandedLesson = null;
    } else {
      this.expandedLesson = lesson;
    }
  }

  toggleSelection(lesson: Lesson){
    this.selection.toggle(lesson)
  }

  private loadDataFromServer() {
    this.isLoading = true;
    this.coursesService.findLessons(this.course.id,
      this.matSort?.direction ?? 'asc',
      this.matPaginator?.pageIndex ?? 0,
      this.matPaginator?.pageSize ?? 3,
      this.matSort?.active ?? 'seqNo'
      )
      .pipe(
        tap(value => this.lessons = value),
        catchError((err: unknown) => {
          alert(err);
          return throwError(err);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  isAllSelected() {
   return this.selection.selected?.length === this.lessons.length;
  }
  selectAll(){
    if(this.isAllSelected()){
      this.selection.clear();
    } else {
      this.selection.select(...this.lessons)
    }
  }
}
