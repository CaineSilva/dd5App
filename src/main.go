package main

import (
	"flag"
	"os"

	"pnjgenerator/src/frontend"
	"pnjgenerator/src/backend"
)

func main() {
	var (
		templatePath string 
		outPath string
		staticPath string 
		frontPort string
		backPort string
		openBrowser bool
		help bool
		npcRoute string
	)
	flag.StringVar(&templatePath, "templatePath", "../templates", "Local path to the template folder")
	flag.StringVar(&outPath, "out", "../out", "Local path to the folder on which generated files will be saved")
	flag.StringVar(&staticPath, "static", "../front/build", "Local path to the folder containing the front static files")
	flag.StringVar(&frontPort, "frontPort", "23456", "Local port on which the frontend application is started")
	flag.StringVar(&backPort, "backPort", "12345", "Local port on which the backend application is started")
	flag.StringVar(&npcRoute, "npcRoute", "/npc", "URI of the REST route for NPC backend")
	flag.BoolVar(&help, "help", false, "Display the help of the program")
	flag.BoolVar(&openBrowser, "openBrowser", true, "If set to false, the default browser will not pop up automatically with the frontend page")
	flag.Parse()

	if help {
		flag.PrintDefaults()
		os.Exit(0)
	}

	backendServer := backend.CreateBackend(
		backend.BackendConfig{
			Port: backPort, 
			TemplatePath: templatePath,
			OutPath: outPath,
			NPCRoute: npcRoute,
		},
	)
	backendServer.Start()
	frontendServer := frontend.CreateFrontend(
		frontend.FrontendConfig{
			Port: frontPort, 
			StaticPath: staticPath,
			NPCRoute: npcRoute,
			BackendPort: backPort,
		},
	)
	frontendServer.Start()
	if openBrowser {
		frontendServer.OpenBrowser()
	}
	select {}
}