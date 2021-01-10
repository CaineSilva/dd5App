package backend

type Backend interface {
	Start()
}

type BackendConfig struct {
	Port string
	TemplatePath string
	OutPath string
	NPCRoute string
	AideddRoute string
}

func CreateBackend(config BackendConfig) Backend {
	return &httpBackend{
		port: config.Port,
		templatePath: config.TemplatePath,
		outPath: config.OutPath,
		npcRoute: config.NPCRoute,
		aideddRoute: config.AideddRoute,
	}
}