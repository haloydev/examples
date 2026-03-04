package main

import (
	"embed"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"sync"
)

//go:embed templates
var templateFS embed.FS

var tmpl = template.Must(template.ParseFS(templateFS, "templates/*.html"))

type Todo struct {
	ID   int
	Text string
	Done bool
}

type App struct {
	mu     sync.Mutex
	todos  []Todo
	nextID int
}

func main() {
	app := &App{
		todos: []Todo{
			{ID: 1, Text: "Learn HTMX", Done: false},
			{ID: 2, Text: "Build something with Go", Done: true},
		},
		nextID: 3,
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})
	mux.HandleFunc("GET /", app.handleIndex)
	mux.HandleFunc("POST /todos", app.handleAddTodo)
	mux.HandleFunc("PUT /todos/{id}/toggle", app.handleToggleTodo)
	mux.HandleFunc("DELETE /todos/{id}", app.handleDeleteTodo)

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func (a *App) handleIndex(w http.ResponseWriter, r *http.Request) {
	a.mu.Lock()
	defer a.mu.Unlock()
	tmpl.ExecuteTemplate(w, "index.html", a.todos)
}

func (a *App) handleAddTodo(w http.ResponseWriter, r *http.Request) {
	text := r.FormValue("text")
	if text == "" {
		http.Error(w, "text is required", http.StatusBadRequest)
		return
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	todo := Todo{ID: a.nextID, Text: text, Done: false}
	a.nextID++
	a.todos = append(a.todos, todo)

	tmpl.ExecuteTemplate(w, "todo-item", todo)
}

func (a *App) handleToggleTodo(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	for i := range a.todos {
		if a.todos[i].ID == id {
			a.todos[i].Done = !a.todos[i].Done
			tmpl.ExecuteTemplate(w, "todo-item", a.todos[i])
			return
		}
	}

	http.Error(w, "not found", http.StatusNotFound)
}

func (a *App) handleDeleteTodo(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	a.mu.Lock()
	defer a.mu.Unlock()

	for i := range a.todos {
		if a.todos[i].ID == id {
			a.todos = append(a.todos[:i], a.todos[i+1:]...)
			w.WriteHeader(http.StatusOK)
			return
		}
	}

	http.Error(w, "not found", http.StatusNotFound)
}
