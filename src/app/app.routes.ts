// src/app/app.routes.ts
import { Routes, ActivatedRouteSnapshot } from '@angular/router';
import { ToDoListLayoutComponent } from './To-do-list/layout/To-do-list-layout/To-do-list-layout.component'
import { ToDoListPageTasksComponent } from './To-do-list/components/To-do-list-TasksPage/To-do-list-page-tasks.component';
import { ToDoListEditComponent } from './To-do-list/components/To-do-list-edit/To-do-list-edit.component'
import { AuthFormComponent } from './To-do-list/auth/auth-form/auth-form.component';
import { authGuard } from './To-do-list/auth/auth.guard';

const getPageTitleStatic = (route: ActivatedRouteSnapshot): string => {
  const status = route.paramMap.get('status');
  // Switch to change title, to the one of the state
  switch (status) {
    case 'Non Started': return 'Non started Tasks';
    case 'In Progress': return 'In progress Tasks';
    case 'Paused': return 'Paused Tasks';
    case 'Late': return 'Late Tasks';
    case 'Finished': return 'Finished tasks';
    default: return 'Tasks';
  }
};

export const routes: Routes = [
  {
    path: 'login',
    component: AuthFormComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: AuthFormComponent,
    title: 'Register'
  },
  {
    path: '', // Main route
    component: ToDoListLayoutComponent,
    canActivate: [authGuard], // The guard for the child routes
    children: [
      { path: '', redirectTo: 'tasks/Non Started', pathMatch: 'full' },
      {
        path: 'tasks/:status',
        component: ToDoListPageTasksComponent,
        title: getPageTitleStatic
      },
      {
        path: 'edit-task',
        component: ToDoListEditComponent,
        title: 'Edit Task'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];