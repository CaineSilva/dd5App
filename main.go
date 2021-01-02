package main

import (
	"fmt"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os/exec"
	"runtime"
)

func serveReact() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	router.Use(static.Serve("/", static.LocalFile("./front/build", true)))

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}

	// Start and run the server
	router.Run(":23456")
}

func main() {
	var (
		err error
		cmd *exec.Cmd
	)
	go serveReact()
	url := "http://localhost:23456"

	switch runtime.GOOS {
	case "linux":
		cmd = exec.Command("xdg-open", url)
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default:
		err = fmt.Errorf("unsupported platform")
	}
	if err != nil {
		log.Fatal(err)
	}
	err = cmd.Start()
	if err != nil {
		log.Fatal(err)
	}
	cmd.Wait()
	srv := Server{address: ":12345"}
	srv.Start()
}
