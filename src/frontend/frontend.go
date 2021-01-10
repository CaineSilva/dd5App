package frontend

type Frontend interface {
	Start()
	OpenBrowser()
}

type FrontendConfig struct {
	Port string
	StaticPath string 
	BackendPort string
	NPCRoute string
	AideddRoute string
	Version string
}

func CreateFrontend(config FrontendConfig) Frontend {
	return &reactFrontend{
		port: config.Port,
		staticPath: config.StaticPath,
		backendPort: config.BackendPort,
		npcRoute: config.NPCRoute,
		aideddRoute: config.AideddRoute,
		version: config.Version,
	}
}