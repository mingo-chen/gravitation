package cm.study.gravitation.service

object Hello {

  def greet(name: String)(implicit prompt: String): Unit = {
    println("Welcome, " + name + ". The System is ready.")
    println(prompt)
  }

  def main(args: Array[String]): Unit = {
    implicit val prompt = "hello, scala!"
    greet("cm")
  }
}
