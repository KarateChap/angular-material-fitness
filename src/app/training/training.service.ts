import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';

import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  DocumentReference,
  docSnapshots,
  docData,
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { addDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private firestore: Firestore, private uiService: UIService) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    const colRef = collection(this.firestore, 'availableExercises');

    this.fbSubs.push(
      collectionData(colRef, { idField: 'id' }).subscribe(
        (exercises: Exercise[]) => {
          this.uiService.loadingStateChanged.next(false);
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        }, error => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar('Fetching exercises failed, please try again later.', null, 3000)
          this.exercisesChanged.next(null);
        }
      )
    );
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    const colRef = collection(this.firestore, 'finishedExercises');
    this.fbSubs.push(
      collectionData(colRef, { idField: 'id' }).subscribe(
        (exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        }
      )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  private addDataToDatabase(exercise: Exercise) {
    const exerciseRef = collection(this.firestore, 'finishedExercises');
    addDoc(exerciseRef, exercise);
  }
}

// const colRef = collection(this.firestore, 'availableExercises');
// collectionData(colRef, { idField: 'id' });

// const docRef = doc(
//   this.firestore,
//   'availableExercises/o1dw7Cmc0qSZFIOLhVUf'
// );
// docData(docRef, { idField: 'id' }).subscribe((res) => {
//   console.log(res);
// });

// const snapRef = doc(
//   this.firestore,
//   'availableExercises/o1dw7Cmc0qSZFIOLhVUf'
// );
// docSnapshots(snapRef).subscribe((res) => {
//   console.log(res);
// });

// const exerciseRef = collection(this.firestore, 'availableExercises');
// addDoc(exerciseRef, exercise);

// const exerciseDocRef = doc(this.firestore, 'availableExercises/${id}');
// deleteDoc(exerciseDocRef);

// const exerciseDocRef = doc(this.firestore, 'availableExercises/${id}');
// updateDoc(exerciseDocRef, {name: 'hehe', duration: 'hehe', calories: 'hehe'});
