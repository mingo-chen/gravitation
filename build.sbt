organization := "cm.study.scala"

name := "gravitation"

version := "1.0"

scalaVersion := "2.12.4"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")


lazy val aggregatedProjects: Seq[ProjectReference] = Seq(
  gravitation_open,
  gravitation_service,
  views,
)

//Revolver.settings
lazy val root = Project(
  id = "gravitation",
  base = file(".")
)

lazy val gravitation_open = Project(
  id = "gravitation-open",
  base = file("gravitation-open")
).aggregate(gravitation_service)
    .dependsOn(gravitation_service)
    .settings(
      libraryDependencies ++= {
        val scalaTestV  = "3.0.1"

        Seq(
          "org.scalatest"     %% "scalatest" % scalaTestV % "test"
        )
      }
    )

lazy val gravitation_service = Project(
  id = "gravitation-service",
  base = file("gravitation-service")

).settings(
  libraryDependencies ++= {
    val akkaV       = "2.5.10"
    val scalaTestV  = "3.0.1"
    val akkaHttpV = "10.1.0-RC2"
    val slickV = "3.2.0-M2"

    Seq(
      "com.typesafe.akka" %% "akka-actor" % akkaV,
      "com.typesafe.akka" %% "akka-stream" % akkaV,
      "com.typesafe.akka" %% "akka-http-core" % akkaHttpV,
      "com.typesafe.akka" %% "akka-http" % akkaHttpV,
      "com.typesafe.akka" %% "akka-http-testkit" % akkaHttpV,
      "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpV,
      "com.typesafe.akka" %% "akka-http-jackson" % akkaHttpV,
      "com.typesafe.akka" %% "akka-http-xml" % akkaHttpV,
      "com.typesafe.slick" %% "slick" % slickV,

      "org.slf4j" % "slf4j-nop" % "1.6.4",
      "com.typesafe.slick" %% "slick-hikaricp" % slickV,
      "com.h2database" % "h2" % "1.4.193",
      "org.json4s" %% "json4s-jackson" % "3.5.3",
      "mysql" % "mysql-connector-java" % "5.1.40",
      "org.flywaydb" % "flyway-core" % "3.2.1",
      "org.scalatest"     %% "scalatest" % scalaTestV % "test"
    )
  }
)

lazy val views = Project(
  id = "gravitation-views",
  base = file("gravitation-views")
)