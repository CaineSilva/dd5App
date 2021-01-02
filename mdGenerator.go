package main

type MdGenerator interface {
	GenerateFile() error
}