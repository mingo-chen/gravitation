package cm.study.gravitation.utils;

import akka.actor.*;
import akka.routing.RoundRobinPool;
import com.typesafe.config.ConfigFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Created by chenming on 2017/8/1.
 */
@Component
public class SpringExt extends AbstractExtensionId<SpringExt.SpringExtension>{

//    private static ActorSystem actorSystem = ActorSystem.create("gravitation", ConfigFactory.load());

    public static SpringExt ActorPrvider = new SpringExt();

    @Override
    public SpringExtension createExtension(ExtendedActorSystem system) {
        return new SpringExtension();
    }

    public static class SpringExtension implements Extension {
        protected volatile ApplicationContext applicationContext;

        public void initialize(ApplicationContext applicationContext) {
            this.applicationContext = applicationContext;
        }

        public Props props(String actorBeanName) {
            return Props.create(SpringActorProducer.class, applicationContext, actorBeanName);
        }
    }

}
