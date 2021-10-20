package main

import (
	"flag"
	"os"

	"github.com/CaineSilva/dd5App/src/backend"
	"github.com/CaineSilva/dd5App/src/frontend"
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
		aideddRoute string
		noFrontend bool
		noBackend bool
		version string
	)
	flag.StringVar(&templatePath, "templatePath", "../templates", "Local path to the template folder")
	flag.StringVar(&outPath, "out", "../out", "Local path to the folder on which generated files will be saved")
	flag.StringVar(&staticPath, "static", "../front/build", "Local path to the folder containing the front static files")
	flag.StringVar(&frontPort, "frontPort", "23456", "Local port on which the frontend application is started")
	flag.StringVar(&backPort, "backPort", "12345", "Local port on which the backend application is started")
	flag.StringVar(&npcRoute, "npcRoute", "/npc", "URI of the REST route for NPC backend")
	flag.StringVar(&aideddRoute, "aideddRoute", "/aidedd", "URI of the REST route for aidedd backend")
	flag.BoolVar(&help, "help", false, "Display the help of the program")
	flag.BoolVar(&openBrowser, "openBrowser", true, "If set to false, the default browser will not pop up automatically with the frontend page")
	flag.BoolVar(&noBackend, "noBackend", false, "If set to true, only the frontend server will be launched")
	flag.BoolVar(&noFrontend, "noFrontend", false, "If set to true, only the backend server will be launched")
	flag.StringVar(&version, "version", "inconnue", "Version of the application in vX.Y format")
	flag.Parse()

	if help {
		flag.PrintDefaults()
		os.Exit(0)
	}
	if !noBackend{
		backendServer := backend.CreateBackend(
			backend.BackendConfig{
				Port: backPort, 
				TemplatePath: templatePath,
				OutPath: outPath,
				NPCRoute: npcRoute,
				AideddRoute: aideddRoute,
			},
		)
		backendServer.Start()
	}
	if !noFrontend {
		frontendServer := frontend.CreateFrontend(
			frontend.FrontendConfig{
				Port: frontPort, 
				StaticPath: staticPath,
				NPCRoute: npcRoute,
				BackendPort: backPort,
				AideddRoute: aideddRoute,
				Version: version,
			},
		)
		frontendServer.Start()
		if openBrowser {
			frontendServer.OpenBrowser()
		}
	}
	select {}
}