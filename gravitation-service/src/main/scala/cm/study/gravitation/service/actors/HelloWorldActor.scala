package cm.study.gravitation.service.actors

import akka.actor.{AbstractActor, UntypedActor}
import org.slf4j.LoggerFactory

class HelloWorldActor extends UntypedActor {

  val ILOG = LoggerFactory.getLogger(this.getClass.getName)

  override def onReceive(message: Any): Unit = {
    ILOG.info("--> {}", message)
  }
}
