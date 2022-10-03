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

import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import { take } from 'rxjs';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private firestore: Firestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    const colRef = collection(this.firestore, 'availableExercises');

    this.fbSubs.push(
      collectionData(colRef, { idField: 'id' }).subscribe(
        (exercises: Exercise[]) => {
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        },
        (error) => {
          // this.uiService.loadingStateChanged.next(false);
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar(
            'Fetching exercises failed, please try again later.',
            null,
            3000
          );
        }
      )
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed',
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled',
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  fetchCompletedOrCancelledExercises() {
    const colRef = collection(this.firestore, 'finishedExercises');
    this.fbSubs.push(
      collectionData(colRef, { idField: 'id' }).subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }
      )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => {
      sub.unsubscribe();
    });
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
