package frontend

import (
	"fmt"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"os"
	"os/exec"
	"runtime"
)

var FRONT_CONF = `{
	"backendPort": %v, 
	"npcRoute": "%v", 
	"aideddRoute": "%v",
	"version": "%v"
}`

type reactFrontend struct {
	port string
	staticPath string
	npcRoute string
	backendPort string
	aideddRoute string
	version string
} 

func (this *reactFrontend) Start() {
	go func(){
		err := os.Remove(this.staticPath + "/Config.json")
		if err != nil {
			fmt.Println("[FRONTEND] : " + err.Error())
		}
		file, err := os.OpenFile(this.staticPath + "/Config.json", os.O_WRONLY | os.O_CREATE, 0777)
		if err != nil {
			fmt.Println("[FRONTEND] : " + err.Error())
		}
		file.Write([]byte(fmt.Sprintf(FRONT_CONF, this.backendPort, this.npcRoute, this.aideddRoute, this.version)))
		file.Close()
		gin.SetMode(gin.ReleaseMode)
		router := gin.New()
		router.Use(gin.Logger())
		router.Use(static.Serve("/", static.LocalFile(this.staticPath, true)))
		router.Run(":" + this.port)
	}()
}

func (this *reactFrontend) OpenBrowser() {
	go func(){
		var (
			err error
			cmd *exec.Cmd
		)
		url := "http://localhost:" + this.port

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
			fmt.Println("BACKEND: " + err.Error())
		}
		err = cmd.Start()
		if err != nil {
			fmt.Println("BACKEND: " + err.Error())
		}
	}()
}