import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.trainingService.fetchAvailableExercises();
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
      }
    );
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}
