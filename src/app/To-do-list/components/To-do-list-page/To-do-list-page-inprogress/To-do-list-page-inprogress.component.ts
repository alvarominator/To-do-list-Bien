// src/app/To-do-list/components/to-do-list-page-inprogress/to-do-list-page-inprogress.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { TagModule } from 'primeng/tag';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { Subscription } from 'rxjs';
import { ToDoListEditComponent } from '../../To-do-list-edit/To-do-list-edit.component';

@Component({
    selector: 'to-do-list-page-inprogress',
    standalone: true,
    imports: [CommonModule, ButtonModule, InputTextModule, DialogModule, Textarea, FormsModule, ToDoListEditComponent, TagModule],
    templateUrl: './to-do-list-page-inprogress.component.html',
    providers: [DatePipe]
})
export class ToDoListPageInprogressComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    showDialog = false;
    newTask: Task = this.emptyTask('In Progress');
    showEditForm = false;
    selectedTask: Task | null = null;
    categories: Category[] = [];
    private readonly STORAGE_KEY = 'inprogress-tasks';
    private categoriesSubscription?: Subscription;

    constructor(private datePipe: DatePipe, private categoryService: CategoryService) { }

    ngOnInit() {
        this.categoriesSubscription = this.categoryService.getCategories().subscribe(categories => {
            this.categories = categories;
            this.loadTasks();
        });
    }

    ngOnDestroy() {
        this.saveTasks();
        if (this.categoriesSubscription) {
            this.categoriesSubscription.unsubscribe();
        }
    }

    loadTasks() {
        const storedTasks = localStorage.getItem(this.STORAGE_KEY);
        this.tasks = storedTasks ? JSON.parse(storedTasks, (key, value) => {
            if (key === 'dueDate' && value) {
                return new Date(value);
            }
            if (key === 'createdAt' && value) {
                return new Date(value);
            }
            if (key === 'updatedAt' && value) {
                return new Date(value);
            }
            return value;
        }) : [];
        console.log('Tareas In Progress cargadas:', this.tasks);
    }

    saveTasks() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        }));
        console.log('Tareas In Progress guardadas:', this.tasks);
    }

    openDialog() {
        this.newTask = this.emptyTask('In Progress');
        this.showDialog = true;
    }

    saveTask() {
        this.newTask.id = crypto.randomUUID();
        const now = new Date();
        this.newTask.createdAt = now;
        this.newTask.updatedAt = now;
        this.tasks.push({ ...this.newTask });
        this.showDialog = false;
        this.newTask = this.emptyTask('In Progress');
        this.saveTasks();
    }

    getCategoryName(categoryId: string): string {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown Category';
    }

    editTask(task: Task) {
        this.selectedTask = { ...task };
        this.showEditForm = true;
    }

    openEditForm(task: Task) {
        this.selectedTask = { ...task };
        this.showEditForm = true;
    }

    onEditFormClosed(taskUpdated: Task | null) {
        this.showEditForm = false;
        this.selectedTask = null;
        if (taskUpdated) {
            const index = this.tasks.findIndex(t => t.id === taskUpdated.id);
            if (index !== -1) {
                this.tasks[index] = { ...taskUpdated };
                this.saveTasks();
            }
        }
    }

    onTaskDeleted(taskToDelete: Task) {
        if (taskToDelete && taskToDelete.id) {
            this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);
            this.saveTasks();
            this.selectedTask = null;
            this.showEditForm = false;
        }
    }

    private emptyTask(status: 'Non Started' | 'In Progress' | 'Paused' | 'Late' | 'Finished'): Task {
        return {
            id: '',
            title: '',
            description: '',
            status: status,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: [],
            dueDate: undefined,
            categories: [],
            tags: [],
        };
    }
}