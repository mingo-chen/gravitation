package cm.study.gravitation.utils;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import akka.actor.Props;
import com.typesafe.config.ConfigFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Created by chenming on 2017/8/1.
 */
@Component
public class ContextHolder implements ApplicationContextAware {

    private static ApplicationContext applicationContext;

    private static ActorSystem actorSystem = ActorSystem.create("chenming", ConfigFactory.load());

    public static ActorRef build(String actorName) {
        Props props = SpringExt.ActorPrvider.get(actorSystem).props(actorName);
        return actorSystem.actorOf(props, actorName);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringExt.ActorPrvider.get(actorSystem).initialize(applicationContext);
        ContextHolder.applicationContext = applicationContext;
    }

}
