package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v2"
)

/*
* 絶対欲しいのは url と 巻の数だけなのである程度妥協する
 */

type TocType struct {
	P    int    `json:"p"`
	Name string `json:"name"`
}

type Volume struct {
	Count int `json:"count"`
	// Toc   TocType `json:"toc"`
	// Bundle bool    `json:"bundle"`
	// Reverse bool    `json:"reverse"`
}

type Info struct {
	Title  string
	Prefix string
	Suffix string
}

type Work struct {
	Url   string `json:"url"`
	Title string `json:"title"`
	// Info    Info       `json:"info"`
	Volumes VolumesMap `json:"volumes"`
}

type VolumesMap map[string]Volume

type BaseData map[string]Work

type Works struct {
	Url   string `json:"url"`
	Title string `json:"title"`
}

type Config struct {
	BasePath string
	Data     BaseData
	Works    []Works
	Dst      string `yaml:"dst"`
	Css      string `yaml:"css"`
	Js       string `yaml:"js"`
}

var (
	cfg      Config
	baseData BaseData
	works    []Works
)

func (cfg *Config) load(f1, f2 string) error {
	// works for toppage
	b1, err := os.ReadFile(f1)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(b1, &works); err != nil {
		return err
	}
	// fmt.Printf("%+v\n", b1)

	// baseData for pages
	b2, err := os.ReadFile(f2)
	if err != nil {
		return err
	}
	if err := json.Unmarshal(b2, &baseData); err != nil {
		return err
	}

	buf, err := os.ReadFile("config.yaml")
	if err != nil {
		log.Fatal(err)
	}
	err = yaml.Unmarshal(buf, &cfg)
	if err != nil {
		log.Fatal(err)
	}

	basePath := os.Getenv("BASE_PATH")
	cfg.BasePath = basePath
	cfg.Data = baseData
	cfg.Works = works
	return nil
}

func (cfg *Config) convertFile(tpl, dst string) {
	// toppage
	t := template.Must(template.ParseFiles(tpl))

	meta := cfg
	new_buf := new(bytes.Buffer)
	if err := t.Execute(new_buf, meta); err != nil {
		log.Println("create file", err)
	}
	os.WriteFile(dst, new_buf.Bytes(), 0644)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}
	cfg.load("data/works.json", "data/data.json")
	// fmt.Println(cfg)

	// トップページ
	if err := os.MkdirAll(cfg.Dst, 0755); err != nil {
		fmt.Println(err)
	}
	dst := cfg.Dst + "index.html"
	cfg.convertFile("layout/home.html", dst)

	// fmt.Printf("%+v\n", cfg.Data)
	for _, v := range cfg.Data {
		// 作品トップ
		if err := os.MkdirAll(cfg.Dst+v.Url, 0755); err != nil {
			// fmt.Println(err)
		}
		dst = cfg.Dst + "/" + v.Url + "/index.html"
		cfg.convertFile("layout/comics-top.html", dst)
		// fmt.Printf("%+v\n", v.Url)
		for k := range v.Volumes {
			// 個別のページ
			// fmt.Printf("%+v\n", k)
			dst = cfg.Dst + "/" + v.Url + "/" + k + ".html"
			cfg.convertFile("layout/page.html", dst)
		}
	}
}
